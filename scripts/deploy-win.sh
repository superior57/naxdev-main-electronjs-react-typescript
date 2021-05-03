# #!/bin/bash
echo "==================== Build success for $1-$2 ===================="
echo "==================== Uploading to server ===================="
pscp -P 22 -pw dN#4qHMT6J7qoSho $1-$2-prod-$3.zip root@202.182.116.72:/var/www/nax_API/_server/uploads/versions/
rm ./"$1"-"$2"-prod-"$3".zip
echo "==================== Successfully Uploaded ===================="
cd scripts || exit
echo "==================== Logging into server  ===================="
putty -pw dN#4qHMT6J7qoSho -ssh root@202.182.116.72 -m ./server.sh
