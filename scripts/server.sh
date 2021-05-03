BUILD_OS="win32"
ARTCH="x64"
VERSION="1.1.3"
TYPE="major"

echo "==================== Logged in success  ===================="
if [[ $TYPE == "major" ]]; then
echo "==================== Unzipping File  ===================="
cd /var/www/nax_API/_server/uploads/versions/ || exit
mkdir $BUILD_OS-$ARTCH-prod-$VERSION 
unzip -o ./$BUILD_OS-$ARTCH-prod-$VERSION.zip -d $BUILD_OS-$ARTCH-prod-$VERSION 
rm ./$BUILD_OS-$ARTCH-prod-$VERSION.zip
echo "==================== Unzipped Success  ===================="
fi

if [[ $BUILD_OS == "darwin" ]]; then
  OS="Mac"
elif [[ $BUILD_OS == "win32" ]]; then
  OS="Window"
elif [[ $BUILD_OS == "linux" ]]; then
  OS="Ubuntu"
fi

if [[ $TYPE == "minor" ]]; then
  FILE_PATH="uploads/versions/$BUILD_OS-$ARTCH-prod-$VERSION.zip"
elif [[ $TYPE == "major" ]]; then
  FILE_PATH="uploads/versions/$BUILD_OS-$ARTCH-prod-$VERSION"
fi
echo "==================== Inserting into DB ===================="
mysql -u naxcloud -pnaxcloud@admin -e "use naxcloud;insert into versions (version_num,operating_system,version_type,change_log,architecture,file,file_path) values('$VERSION','$OS','$TYPE','','$ARTCH','$BUILD_OS-$ARTCH-prod-$VERSION','$FILE_PATH')"
echo "==================== Exiting from server  ===================="
exit
