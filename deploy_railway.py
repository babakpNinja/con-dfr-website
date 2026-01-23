import urllib.request
import json

# Railway API configuration
TOKEN = open('/workspace/.railway_token').read().strip()
SERVICE_ID = "6259b737-374c-4317-84ea-16a51c89d056"
ENVIRONMENT_ID = "ec5487e4-7b30-4419-b6d0-2842442872ca"

# GraphQL mutation to redeploy
query = f'mutation {{ serviceInstanceRedeploy(serviceId: "{SERVICE_ID}", environmentId: "{ENVIRONMENT_ID}") }}'

data = json.dumps({"query": query}).encode('utf-8')

req = urllib.request.Request(
    'https://backboard.railway.app/graphql/v2',
    data=data,
    headers={
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }
)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(json.dumps(result, indent=2))
        if result.get('data', {}).get('serviceInstanceRedeploy'):
            print("\n✅ Deployment triggered successfully!")
        else:
            print("\n❌ Deployment may have failed. Check the response above.")
except Exception as e:
    print(f"Error: {e}")