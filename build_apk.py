#!/usr/bin/env python3
import os
import sys
import zipfile
import subprocess

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
UNALIGNED_APK = os.path.join(PROJECT_DIR, 'yesmin_unaligned.apk')
FINAL_APK = os.path.join(PROJECT_DIR, 'Yesmin.apk')
KEYSTORE = os.path.join(PROJECT_DIR, 'yunay.jks')

stored_exts = {'.so', '.png', '.jpg', '.jpeg', '.webp', '.arsc', '.mp3', '.wav', '.ogg'}

print("📦 1/3: Packing APK archive...")
if os.path.exists(UNALIGNED_APK):
    os.remove(UNALIGNED_APK)

with zipfile.ZipFile(UNALIGNED_APK, 'w') as z_out:
    # AndroidManifest & resources.arsc first
    manifest_path = os.path.join(PROJECT_DIR, 'AndroidManifest.xml')
    if os.path.exists(manifest_path):
        z_out.write(manifest_path, 'AndroidManifest.xml', compress_type=zipfile.ZIP_DEFLATED)
    
    arsc_path = os.path.join(PROJECT_DIR, 'resources.arsc')
    if os.path.exists(arsc_path):
        z_out.write(arsc_path, 'resources.arsc', compress_type=zipfile.ZIP_STORED)

    for root, dirs, files in os.walk(PROJECT_DIR):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, PROJECT_DIR)
            if f.startswith('.trashed') or f.endswith('.idsig') or rel_path in {'AndroidManifest.xml', 'resources.arsc', 'Yesmin.apk', 'yesmin_unaligned.apk', 'yunay.jks', 'build_apk.py', 'push_to_github.sh', 'README.md'}:
                continue
            if rel_path.startswith('.git') or rel_path.startswith('.github') or f.endswith('.sh'):
                continue
            
            ext = os.path.splitext(f)[1].lower()
            if ext in stored_exts or f == 'resources.arsc':
                comp = zipfile.ZIP_STORED
            else:
                comp = zipfile.ZIP_DEFLATED
            z_out.write(full_path, rel_path, compress_type=comp)

print(f"Created unaligned APK ({os.path.getsize(UNALIGNED_APK)} bytes).")

print("⚡ 2/3: Running zipalign (4-byte alignment)...")
if os.path.exists(FINAL_APK):
    os.remove(FINAL_APK)

cmd_zipalign = ['zipalign', '-f', '-p', '4', UNALIGNED_APK, FINAL_APK]
res = subprocess.run(cmd_zipalign)
if res.returncode != 0:
    print("Error: zipalign failed!")
    sys.exit(1)

print("✍️ 3/3: Signing APK with apksigner...")
cmd_sign = [
    'apksigner', 'sign',
    '--ks', KEYSTORE,
    '--ks-pass', 'pass:123456',
    '--key-pass', 'pass:123456',
    '--v1-signing-enabled', 'true',
    '--v2-signing-enabled', 'true',
    '--v3-signing-enabled', 'true',
    FINAL_APK
]
res = subprocess.run(cmd_sign)
if res.returncode != 0:
    print("Error: apksigner failed!")
    sys.exit(1)

cmd_verify = ['apksigner', 'verify', '--verbose', FINAL_APK]
subprocess.run(cmd_verify)

if os.path.exists(UNALIGNED_APK):
    os.remove(UNALIGNED_APK)

print(f"\n🎉 Build Successful! APK generated: {FINAL_APK} ({os.path.getsize(FINAL_APK)} bytes)")
