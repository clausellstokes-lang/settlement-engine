#!/bin/bash
cd "$1" || exit 1
for k in prison forces navy magicWorks structureKey blackMarketCapture blockadeBypass notableAbsences impairedInstitution primaryStress viable garrison; do
  n=$(grep -rEn "(^|[^A-Za-z0-9_.])${k}[[:space:]]*:" src/generators/ src/domain/ 2>/dev/null | wc -l | tr -d ' ')
  m=$(grep -rEn "\.${k}[[:space:]]*=[^=]" src/generators/ src/domain/ 2>/dev/null | wc -l | tr -d ' ')
  echo "$k objlit-key=$n assign=$m"
done
