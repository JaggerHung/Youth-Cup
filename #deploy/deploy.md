DEPLOY <domain.com> on EC2
===

1. Clone domain.com source code

    SSH to EC2
    ```
    sudo -su root
    cd /var/www/
    git clone ...
    ```
2. Create nginx config for domain.com
    ```
    cd /etc/nginx/sites-available/
    cp jonescup.choxue.com domain.com
    nano domain.com
    ```
    
    - Find and replace **jonescup.choxue.com** to **domain.com** and
    - Change source code folder path
    - When done: Ctrl + X to save
    
    ```
    sudo ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/.
    sudo service nginx restart
    ```
3. Install dependencies

    Go to domain.com source code folder
    ```
    bower install --allow-root
    npm install
    ./node_modules/webpack/bin/webpack.js -p
    ```
    
4. Done