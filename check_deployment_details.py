import urllib.request
import json

TOKEN = open('/workspace/.railway_token').read().strip()
SERVICE_ID = "6259b737-374c-4317-84ea-16a51c89d056"
ENVIRONMENT_ID = "ec5487e4-7b30-4419-b6d0-2842442872ca"

# Query to get deployment details including source
query = '''
query {
  deployments(first: 1, input: {serviceId: "%s", environmentId: "%s"}) {
    edges {
      node {
        id
        status
        createdAt
        meta
        staticUrl
      }
    }
  }
}
''' % (SERVICE_ID, ENVIRONMENT_ID)

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
except Exception as e:
    print(f"Error: {e}")