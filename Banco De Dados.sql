CREATE DATABASE JornadaAtiva;
GO
USE JornadaAtiva;
GO
 
/* =======================================================================
   TABELAS BASE
   ======================================================================= */
 
/* -------------------------
   USUÁRIOS
   ------------------------- */
CREATE TABLE dbo.usuarios
(
    id_usuario      BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_usuarios PRIMARY KEY,
    nome            VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL CONSTRAINT UQ_usuarios_email UNIQUE,
    senha_hash      VARCHAR(255)    NOT NULL,
    genero          VARCHAR(10)     NOT NULL,
    data_nascimento DATE            NOT NULL,
    ft_perfil       VARCHAR(255)    NULL,
    nivel           VARCHAR(50)     NOT NULL,
    altura          DECIMAL(3,2)    NOT NULL,   -- ex: 1.75
    peso            DECIMAL(5,2)    NOT NULL,   -- ex: 82.30
    role            VARCHAR(45)     NULL,       -- campo legado/compat, não usado no auth principal
    created_at      DATETIME2(3)    NOT NULL CONSTRAINT DF_usuarios_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at      DATETIME2(3)    NOT NULL CONSTRAINT DF_usuarios_updated_at DEFAULT (SYSUTCDATETIME())
);
GO
 
/* Trigger para manter updated_at sempre atualizado em UPDATE */
CREATE OR ALTER TRIGGER TR_usuarios_set_updated_at
ON dbo.usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u
       SET updated_at = SYSUTCDATETIME()
      FROM dbo.usuarios u
      JOIN inserted i ON i.id_usuario = u.id_usuario;
END;
GO
 
/* -------------------------
   ROLES
   ------------------------- */
CREATE TABLE dbo.roles
(
    id_role     BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_roles PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL CONSTRAINT UQ_roles_name UNIQUE,  -- ex: ROLE_ADMIN, ROLE_USER
    description VARCHAR(255) NULL
);
GO
 
/* -------------------------
   USUÁRIOS_ROLES (N..N)
   ------------------------- */
CREATE TABLE dbo.usuarios_roles
(
    id_usuario BIGINT NOT NULL,
    id_role    BIGINT NOT NULL,
    CONSTRAINT PK_usuarios_roles PRIMARY KEY (id_usuario, id_role),
    CONSTRAINT FK_usuarios_roles_usuario FOREIGN KEY (id_usuario)
        REFERENCES dbo.usuarios (id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_usuarios_roles_role FOREIGN KEY (id_role)
        REFERENCES dbo.roles (id_role) ON DELETE CASCADE
);
GO
 
/* -------------------------
   TOKENS
   ------------------------- */
CREATE TABLE dbo.tokens
(
    id          BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_tokens PRIMARY KEY,
    token       VARCHAR(255) NOT NULL,
    expired     BIT          NOT NULL CONSTRAINT DF_tokens_expired DEFAULT(0),
    revoked     BIT          NOT NULL CONSTRAINT DF_tokens_revoked DEFAULT(0),
    id_usuario  BIGINT       NOT NULL,
    created_at  DATETIME2(3) NOT NULL CONSTRAINT DF_tokens_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_tokens_usuario FOREIGN KEY (id_usuario)
        REFERENCES dbo.usuarios (id_usuario) ON DELETE CASCADE
);
GO
 
/* =======================================================================
   DOMÍNIO DE TREINOS / HISTÓRICO
   ======================================================================= */
 
/* -------------------------
   TREINO (catálogo de treinos)
   ------------------------- */
CREATE TABLE dbo.treino
(
    id_treino   BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_treino PRIMARY KEY,
    created_at  DATETIME2(3) NULL CONSTRAINT DF_treino_created_at DEFAULT (SYSUTCDATETIME()),
    descricao   VARCHAR(255) NULL,
    nome        VARCHAR(255) NOT NULL,
    nivel       VARCHAR(50) NOT NULL
);
GO
 
/* -------------------------
   HISTÓRICO_TREINO
   ------------------------- */
CREATE TABLE dbo.historico_treino
(
    id_historico_treino BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_historico_treino PRIMARY KEY,
    created_at          DATETIME2(3) NULL CONSTRAINT DF_historico_treino_created_at DEFAULT (SYSUTCDATETIME()),
    data                DATE         NOT NULL,
    distancia           DECIMAL(8,2) NOT NULL,
    kcal                DECIMAL(6,2) NOT NULL,
    pace                DECIMAL(4,2) NOT NULL,
    tempo               DECIMAL(8,2) NOT NULL,
    v_media             DECIMAL(8,2) NOT NULL,
    id_treino           BIGINT       NULL,
    id_usuario          BIGINT       NOT NULL,
    CONSTRAINT FK_hist_treino_treino FOREIGN KEY (id_treino)
        REFERENCES dbo.treino (id_treino),
    CONSTRAINT FK_hist_treino_usuario FOREIGN KEY (id_usuario)
        REFERENCES dbo.usuarios (id_usuario)
);
GO
 
/* -------------------------
   TREINO_PONTOSGPS
   ------------------------- */
CREATE TABLE dbo.treino_pontosgps
(
    id_ponto            BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_treino_pontosgps PRIMARY KEY,
    latitude            DECIMAL(9,6) NOT NULL,
    longitude           DECIMAL(9,6) NOT NULL,
    momento             DATETIME2(3) NOT NULL,
    id_historico_treino BIGINT       NOT NULL,
    CONSTRAINT FK_pontosgps_historico FOREIGN KEY (id_historico_treino)
        REFERENCES dbo.historico_treino (id_historico_treino) ON DELETE CASCADE
);
GO
 
/* =======================================================================
   EVENTOS
   ======================================================================= */
CREATE TABLE dbo.eventos
(
  id_evento     BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_eventos PRIMARY KEY,
  created_at    DATETIME2(3) NULL CONSTRAINT DF_eventos_created_at DEFAULT (SYSUTCDATETIME()),
  data_evento   DATE         NOT NULL,                    -- data do evento
  descricao     VARCHAR(255) NOT NULL,
  imagem_evento VARCHAR(255) NULL,
  link_evento   VARCHAR(255) NOT NULL,
  nome          VARCHAR(255) NOT NULL,
  status          NVARCHAR(20) NOT NULL
 
  -- >>> booleano em SQL Server é BIT (0/1). 1 = ativo, 0 = inativo
  status        BIT NOT NULL CONSTRAINT DF_eventos_status DEFAULT (1)
);
GO
 


 
/* =======================================================================
   AJUSTES/ÍNDICES ÚTEIS
   ======================================================================= */
-- Index auxiliar para busca de usuário por e-mail (além da unique)
CREATE INDEX IX_usuarios_email ON dbo.usuarios(email);
 
-- Índices para histórico e pontos GPS
CREATE INDEX IX_hist_treino_usuario ON dbo.historico_treino(id_usuario, data);
CREATE INDEX IX_pontosgps_hist ON dbo.treino_pontosgps(id_historico_treino);
 
-- Índices que ajudam os endpoints /proximos e métricas mensais
CREATE INDEX IX_eventos_data ON dbo.eventos (data_evento);
CREATE INDEX IX_eventos_status ON dbo.eventos (status);
GO
GO



