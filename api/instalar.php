<?php
/* =====================================================================
   INSTALAR — cria o banco e as tabelas a partir de banco/guardflame.sql
   POST api/instalar.php (cabeçalho X-Chave) — botão da página Banco de dados
   ===================================================================== */
require __DIR__ . '/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(['ok' => false, 'erro' => 'Use o botão da página Banco de dados.'], 405);
exigirChave(corpoJson());

$arquivo = __DIR__ . '/../banco/guardflame.sql';
if (!is_file($arquivo)) responder(['ok' => false, 'erro' => 'Arquivo banco/guardflame.sql não encontrado.'], 500);

/* 1) Tenta criar o banco (em hospedagens o banco é criado pelo painel, então pode falhar sem problema) */
$pdo = banco(false);
try { $pdo->exec('CREATE DATABASE IF NOT EXISTS `' . str_replace('`', '', DB_NOME) . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'); }
catch (PDOException $e) { /* sem permissão: segue com o banco que já existe */ }

/* 2) Roda os comandos do .sql no banco configurado */
$pdo = banco();
$sql = preg_replace('/^\s*--.*$/m', '', file_get_contents($arquivo));
$comandos = array_filter(array_map('trim', preg_split('/;\s*(\r?\n|$)/', $sql)));
$feitos = 0;
foreach ($comandos as $c) {
  if (preg_match('/^(CREATE\s+DATABASE|USE)\b/i', $c)) continue;   // o banco já foi escolhido acima
  try { $pdo->exec($c); $feitos++; }
  catch (PDOException $e) { responder(['ok' => false, 'erro' => 'Erro no comando ' . ($feitos + 1) . ': ' . $e->getMessage()], 500); }
}

$tabelas = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
responder(['ok' => true, 'comandos' => $feitos, 'tabelas' => $tabelas]);
