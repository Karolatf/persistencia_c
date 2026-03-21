-- 1. Crear la base de datos solo si no existe
CREATE DATABASE IF NOT EXISTS inventario_apropiacion;

-- 2. Crear el usuario restringido a localhost con contrasena
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'TORRES_2007';

-- 3. Asignar todos los privilegios de esa base de datos a ese usuario
GRANT ALL PRIVILEGES ON inventario_apropiacion.* TO 'app_user'@'localhost';

-- 4. Aplicar los cambios de privilegios de inmediato
FLUSH PRIVILEGES;

-- 5. Seleccionar la base de datos para empezar a crear las tablas
USE inventario_apropiacion;

-- 6. Crear la tabla de categorias primero porque products depende de ella
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_ud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_up TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Crear la tabla de productos con llave foranea apuntando a categories
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    stock INT DEFAULT 5,
    category_id INT NOT NULL,
    created_ud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_up TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- llave foranea que conecta category_id con el id de la tabla categories
    CONSTRAINT fk_product_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE RESTRICT   -- bloquea borrar una categoria si tiene productos vinculados
    ON UPDATE CASCADE    -- si cambia el id de una categoria se propaga a los productos
);