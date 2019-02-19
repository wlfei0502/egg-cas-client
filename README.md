# egg-cas-client  
  
  
用redis存储session，支持最基本的单点登录，单点登出功能，暂不支持proxy，pt等功能。  

# 插件依赖  
  
  
egg-redis  
  
  
egg-session-redis  
  
# 安装  
  
  ```
  npm install egg-cas-client  
  ```
    
# 配置  
  
  在config.default.js中，配置casClient:  
    
    
    config.casClient = {
        protocol: 'https',
        host: 'sso.example.com',                  // 认证服务器地址
        port: 443,
        paths: {
            serviceValidate: '/serviceValidate',  // 认证服务器票据验证路径
            login: '/login',                      // 应用登录路径
            logout: '/logout'                     // 应用登出路径
        }
    }
      
   在plugin.js中，配置插件：  
     
    redis: {
        enable: true,
        package: 'egg-redis',
    },
    sessionRedis : {
        enable: true,
        package: 'egg-session-redis',
    },
    casClient : {
        enable: true,
        package: 'egg-cas-client',
    }  
        
        
 # 使用  
   
   路由中使用登录、登出中间件：  
       
     // 登录  
     router.get('/login', app.casClient.login(), controller.user.login);  
     
     // 登出  
     router.get('/logout', app.casClient.logout(), controller.user.logout);  
     
 # License  
   MIT
