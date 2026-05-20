#!/bin/bash
# Campaign Monitor MCP — Installer
# Run this once in Terminal to set everything up for Claude Desktop.

set -e

# ─── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

print_step()  { echo -e "\n${BLUE}${BOLD}▶ $1${NC}"; }
print_ok()    { echo -e "  ${GREEN}✓ $1${NC}"; }
print_warn()  { echo -e "  ${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "\n${RED}${BOLD}✗ $1${NC}\n"; }

# ─── Banner ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Campaign Monitor MCP Installer${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "This will install the Campaign Monitor MCP server"
echo "and connect it to Claude Desktop on your Mac."
echo ""

# ─── 1. Check for Node.js ─────────────────────────────────────────────────────
print_step "Checking for Node.js"

NODE_OK=false
if command -v node &>/dev/null; then
  NODE_VERSION=$(node -e "process.exit(parseInt(process.versions.node) < 18 ? 1 : 0)" 2>/dev/null && echo "ok" || echo "old")
  if [ "$NODE_VERSION" = "ok" ]; then
    print_ok "Node.js $(node --version) found"
    NODE_OK=true
  else
    print_warn "Node.js $(node --version) is installed but version 18+ is required"
  fi
else
  print_warn "Node.js not found"
fi

if [ "$NODE_OK" = false ]; then
  echo ""
  echo -e "  ${BOLD}Please install Node.js first:${NC}"
  echo ""
  echo "  1. Go to: https://nodejs.org"
  echo "  2. Download and install the LTS version"
  echo "  3. Re-run this script"
  echo ""
  exit 1
fi

# ─── 2. Check for Git ─────────────────────────────────────────────────────────
print_step "Checking for Git"

if ! command -v git &>/dev/null; then
  echo ""
  echo -e "  ${BOLD}Git is required. Install it by running:${NC}"
  echo ""
  echo "  xcode-select --install"
  echo ""
  echo "  Then re-run this script."
  echo ""
  exit 1
fi
print_ok "Git found"

# ─── 3. Clone or update the repo ──────────────────────────────────────────────
print_step "Installing Campaign Monitor MCP"

INSTALL_DIR="$HOME/claude-tools/cmon-mcp"

if [ -d "$INSTALL_DIR/.git" ]; then
  print_warn "Already installed at $INSTALL_DIR — updating to latest version"
  git -C "$INSTALL_DIR" pull --quiet
  print_ok "Updated"
else
  mkdir -p "$HOME/claude-tools"
  git clone --quiet https://github.com/pauliowest/cmon-mcp.git "$INSTALL_DIR"
  print_ok "Downloaded to $INSTALL_DIR"
fi

# ─── 4. Install dependencies and build ────────────────────────────────────────
print_step "Building"

cd "$INSTALL_DIR"

if ! npm install --cache /tmp/npm-cache 2>&1; then
  print_error "npm install failed. Check the output above for details."
  exit 1
fi

if ! npm run build 2>&1; then
  print_error "Build failed. Check the output above for details."
  exit 1
fi

print_ok "Build complete"

# ─── 5. Prompt for API key ────────────────────────────────────────────────────
print_step "Campaign Monitor API Key"
echo ""
echo "  Your API key is found in Campaign Monitor under:"
echo "  Account Settings → API Keys"
echo ""
echo -n "  Paste your API key and press Enter: "
read -r CM_API_KEY < /dev/tty
echo ""

if [ -z "$CM_API_KEY" ]; then
  print_error "No API key entered. Run the script again and paste your key when prompted."
  exit 1
fi
print_ok "API key received"

# ─── 6. Update Claude Desktop config ─────────────────────────────────────────
print_step "Connecting to Claude Desktop"

CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

mkdir -p "$CONFIG_DIR"

# Use Python to safely merge the new server entry into the existing JSON
python3 - "$CONFIG_FILE" "$INSTALL_DIR" "$CM_API_KEY" <<'PYTHON'
import sys, json, os

config_file = sys.argv[1]
install_dir = sys.argv[2]
api_key     = sys.argv[3]

# Load existing config or start fresh
if os.path.exists(config_file):
    with open(config_file, "r") as f:
        try:
            config = json.load(f)
        except json.JSONDecodeError:
            config = {}
else:
    config = {}

# Ensure mcpServers key exists
if "mcpServers" not in config:
    config["mcpServers"] = {}

# Add/update the Campaign Monitor entry
config["mcpServers"]["Campaign Monitor"] = {
    "command": "node",
    "args": [os.path.join(install_dir, "dist", "index.js")],
    "env": {
        "CM_API_KEY": api_key
    }
}

with open(config_file, "w") as f:
    json.dump(config, f, indent=2)

print("ok")
PYTHON

print_ok "Claude Desktop config updated"

# ─── 7. Done ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}${BOLD}  All done!${NC}"
echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Next step: Quit and relaunch Claude Desktop"
echo ""
echo "  Once restarted, you'll see Campaign Monitor"
echo "  listed as a connected integration."
echo ""
