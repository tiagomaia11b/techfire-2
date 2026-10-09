<?php
/* =====================================================================
   CONEXÃO COM O BANCO DE DADOS — É SÓ EDITAR AQUI
   XAMPP no computador: usuário "root" e senha vazia.
   Hospedagem: use os dados que o painel da hospedagem mostrar.
   ===================================================================== */
const DB_HOST    = 'localhost';
const DB_USUARIO = 'root';
const DB_SENHA   = '';
const DB_NOME    = 'guardflame';

/* Chave secreta: o Raspberry Pi manda junto com o GPS, e a página
   Banco de dados pede para criar as tabelas. TROQUE por uma sua!
   (enquanto for a padrão, a API não deixa gravar nada) */
const CHAVE_API  = 'troque-esta-chave';

/* ---------------------------------------------------------------------
   Daqui para baixo não precisa mexer
   --------------------------------------------------------------------- */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Chave');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

function responder($dados, $codigo = 200) {
  http_response_code($codigo);
  echo json_encode($dados, JSON_UNESCAPED_UNICODE);
  exit;
}

/* Conecta ao MySQL. $comBanco = false conecta sem escolher o banco (para criá-lo). */
function banco($comBanco = true) {
  try {
    $dsn = 'mysql:host=' . DB_HOST . ($comBanco ? ';dbname=' . DB_NOME : '') . ';charset=utf8mb4';
    return new PDO($dsn, DB_USUARIO, DB_SENHA, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
  } catch (PDOException $e) {
    responder(['ok' => false, 'erro' => 'Não conectou ao MySQL: ' . $e->getMessage()], 500);
  }
}

/* Corpo da requisição em JSON */
function corpoJson() {
  $d = json_decode(file_get_contents('php://input'), true);
  return is_array($d) ? $d : [];
}

/* Só deixa gravar quem mandar a chave certa (cabeçalho X-Chave ou "chave" no JSON) */
function exigirChave($corpo = []) {
  if (CHAVE_API === 'troque-esta-chave') responder(['ok' => false, 'erro' => 'Troque a CHAVE_API em api/conexao.php antes de gravar dados.'], 403);
  $chave = $_SERVER['HTTP_X_CHAVE'] ?? ($corpo['chave'] ?? '');
  if (!hash_equals(CHAVE_API, (string) $chave)) responder(['ok' => false, 'erro' => 'Chave da API incorreta.'], 401);
}

/* Número ou null */
function numero($v) { return is_numeric($v) ? $v + 0 : null; }

/* Texto cortado no tamanho máximo, ou null */
function texto($v, $max) {
  if ($v === null || $v === '') return null;
  $v = (string) $v;
  return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}
