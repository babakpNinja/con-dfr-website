import urllib.request
import json

# First login
login_data = json.dumps({"username": "admin", "password": "Congress@2025!Secure"}).encode('utf-8')
login_req = urllib.request.Request(
    'http://localhost:3000/api/login',
    data=login_data,
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(login_req) as response:
        # Get the session cookie
        cookies = response.headers.get('Set-Cookie')
        print("Login response:", response.read().decode('utf-8'))
        print("Cookies:", cookies)
        
        if cookies:
            # Now test translate
            translate_data = json.dumps({
                "name": "Test Organization",
                "description": "This is a test description"
            }).encode('utf-8')
            
            translate_req = urllib.request.Request(
                'http://localhost:3000/api/admin/translate',
                data=translate_data,
                headers={
                    'Content-Type': 'application/json',
                    'Cookie': cookies.split(';')[0]
                }
            )
            
            with urllib.request.urlopen(translate_req) as trans_response:
                result = json.loads(trans_response.read().decode('utf-8'))
                print("\nTranslation result:")
                print(json.dumps(result, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error: {e}")