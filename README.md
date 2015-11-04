# Converts Ionic config.xml -> PhoneGap Build config.xml
- Automatically converts Ionic's config.xml to PhoneGap Build's www/config.xml (So that you can do: phonegap remote build ios)
- Automatically copies icons and splashes inside www/pgb-resources and update paths in www/config.xml


<p align="center">
  <img src ="https://raw.githubusercontent.com/siddiq/pgb-config-maker/master/doc/assets/pgb-config-maker.png" />
</p>


How to use
----------

Go to your ionic app root folder
```
cd myIonicApp
```

Install this script
```
npm install pgb-config-maker --save
```

Run this script to generate awesome config.xml and run: phonegap remote build ios
```
./phonegap-remote-build-ios.sh
```
.ipa generated at https://build.phonegap.com/apps

Caution
-------
These commands will overwrite www/config.xml
```
./phonegap-remote-build-ios.sh
./phonegap-remote-build-android.sh
```
