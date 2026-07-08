import urllib.request
import re
import json

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        return str(e)

html = fetch("https://html.duckduckgo.com/html/?q=site:github.com+%22contact.json%22+lottie+public")
links = re.findall(r'href="(https://github\.com/[^"]+)"', html)

raw_links = []
for link in links:
    if "blob" in link and ".json" in link:
        raw_links.append(link.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/"))

print("CONTACT:")
print(raw_links)
