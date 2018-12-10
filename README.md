# iOS version
## After you got the source code, just follow  these steps to build the project
### 1 Config environment
  - Go to the project folder > FinformApp (Use finder to open this folder, please do not use IDE tool)
  - Rename the config file like this  :
      + ConfigurationDebug.Sample.xcconfig  to ConfigurationDebug.xcconfig
      + ConfigurationRelease.Sample.xcconfig to ConfigurationRelease.xcconfig

  - Apply environment key for config file
      + Use your key for each environment, just paste the value to the following key
        Ex: IDNOW_API_KEY_PROD =  1234

### 2  Prepare Apple Certificate and  Provisioning
  - Prepare the Certificate and  Provisioning

### 3 Install dependences
  - Open terminal and cd to the project folder
  - Run pod install
    + Use this cmd : bundle exec pod install

### 4 Run app
  - Config environment
   + Open project on Xcode > FinformApp > Supporting Files > FinformPrefixHeader.pch
   ```objective-c
   //#define APP_PRODUCTION 1     --> uncomment this line to build on production environment
   //#define APP_INTEGRATION 1    --> uncomment this line to build on integration environment
   //#define APP_TEST 1           --> uncomment this line to build on test environment
   ```
   + Default config is build on Test environment
