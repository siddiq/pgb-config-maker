# pwd = app_folder
echo Creating: www/config.xml
node_modules/pgb-config-maker/make-config-xml.js

echo Running: phonegap remote build $1
phonegap remote build $1

echo Deleting: www/config.xml
rm www/config.xml
