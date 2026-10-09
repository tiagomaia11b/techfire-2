-- =====================================================================
--  BANCO DE DADOS DO TECHFIRE GUARDFLAME (MySQL / MariaDB)
--  Crie pela página Conexão › Banco de dados (botão "Criar banco e
--  tabelas") ou importe este arquivo pelo phpMyAdmin.
--  Pode rodar de novo quantas vezes quiser: não apaga nada.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS guardflame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE guardflame;

-- Contas do site
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  perfil      VARCHAR(50),
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cada missão do drone
CREATE TABLE IF NOT EXISTS voos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  inicio       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fim          DATETIME NULL,
  area         VARCHAR(150),
  observacoes  TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Posição GPS e dados de voo (o Raspberry Pi grava a cada segundo)
CREATE TABLE IF NOT EXISTS telemetria (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  voo_id      INT NULL,
  lat         DECIMAL(10,7) NOT NULL,
  lon         DECIMAL(10,7) NOT NULL,
  altitude    DECIMAL(7,2),
  velocidade  DECIMAL(6,2),
  bateria     TINYINT,
  satelites   TINYINT,
  status      VARCHAR(30),
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_telemetria_data (criado_em),
  FOREIGN KEY (voo_id) REFERENCES voos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Focos de incêndio encontrados pela IA
CREATE TABLE IF NOT EXISTS ocorrencias (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  voo_id      INT NULL,
  lat         DECIMAL(10,7) NOT NULL,
  lon         DECIMAL(10,7) NOT NULL,
  confianca   TINYINT NOT NULL,
  descricao   VARCHAR(255),
  situacao    ENUM('Em atendimento','Controlado','Falso alarme') NOT NULL DEFAULT 'Em atendimento',
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ocorrencias_data (criado_em),
  FOREIGN KEY (voo_id) REFERENCES voos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exemplos (apague quando tiver dados reais)
INSERT IGNORE INTO ocorrencias (id, lat, lon, confianca, descricao, situacao, criado_em) VALUES
  (1, -23.5823000, -46.6489000, 90, 'Chamas e fumaça na imagem', 'Controlado',     '2026-09-21 15:56:00'),
  (2, -23.5399000, -46.6102000, 97, 'Chamas e fumaça na imagem', 'Controlado',     '2026-09-25 09:18:00'),
  (3, -23.5701000, -46.6550000, 61, 'Reflexo do sol no telhado', 'Falso alarme',   '2026-09-28 16:47:00'),
  (4, -23.5487000, -46.6218000, 88, 'Fumaça na imagem',          'Controlado',     '2026-10-02 11:05:00'),
  (5, -23.5612000, -46.6401000, 94, 'Chamas e fumaça na imagem', 'Em atendimento', '2026-10-04 14:32:00');
