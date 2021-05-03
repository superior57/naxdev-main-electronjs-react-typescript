# #!/bin/bash
echo "==================== Build success for $1-$2 ===================="
echo "==================== Uploading to server $1-$2-prod-$3.zip ===================="
sshpass -p dN#4qHMT6J7qoSho scp "$1-$2-prod-$3.zip" root@202.182.116.72:/var/www/nax_API/_server/uploads/versions/
rm ./"$1-$2-prod-$3.zip"
echo "==================== Successfully Uploaded ===================="
cd scripts || exit
echo "==================== Logging into server  ===================="
sshpass -p dN#4qHMT6J7qoSho ssh root@202.182.116.72 bash -s < ./server.sh
