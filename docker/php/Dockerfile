FROM php:8.1-apache

# Instala extensões necessárias do PHP
RUN docker-php-ext-install pdo pdo_mysql

# Ativa o módulo de rewrite no Apache
RUN a2enmod rewrite

# Copia config personalizada do Apache
COPY docker/php/php.ini /usr/local/etc/php/
COPY docker/php/000-default.conf /etc/apache2/sites-available/000-default.conf
