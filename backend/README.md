Auth0 implementation

To run the sample follow these steps:

https://manage.auth0.com/#/applications/HeWDE3azeLRnKArKIxyiUMOZnuuiqEtK/settings

Set the Allowed Callback URLs in the Application Settings to
```bash
http://localhost:4200
```

Set Allowed Web Origins in the Application Settings to 
```bash
http://localhost:4200
```

Set Allowed Logout URLs in the Application Settings to
```bash
http://localhost:4200
```

Make sure Node.JS LTS is installed (https://nodejs.org/en/download/) and execute the following commands in the sample's directory:

```bash
npm install && npm start
```

You can also run it from a Docker image with the following commands:

# In Linux / macOS
```bash
sh exec.sh
```

# In Windows' Powershell
```bash
./exec.ps1
```
