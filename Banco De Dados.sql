-- (Re)criação do banco

IF DB_ID('jornada_ativa') IS NOT NULL
BEGIN
    ALTER DATABASE jornada_ativa SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE jornada_ativa;
END;
GO
CREATE DATABASE jornada_ativa;
GO
USE jornada_ativa;
GO

-- ============= USUARIO =============
CREATE TABLE usuarios (
    id_usuario       BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome             NVARCHAR(255) NOT NULL,
    email            NVARCHAR(255) NOT NULL UNIQUE,
    senha_hash       NVARCHAR(255) NOT NULL,
    genero           VARCHAR(20)   NOT NULL,
    data_nascimento  DATE          NOT NULL,
    ft_perfil        NVARCHAR(255) NULL,
    nivel            INT           NOT NULL,      -- alinha com Integer do código
    altura           DECIMAL(5,2)  NOT NULL,
    peso             DECIMAL(5,2)  NOT NULL,
    role             VARCHAR(45)   NOT NULL,      -- usar enum no código
    created_at       DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    updated_at       DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO
CREATE UNIQUE INDEX ux_usuario_email ON usuario(email);

-- ============= TREINO (catálogo) =============
CREATE TABLE treinos (
    id_treino   BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome        NVARCHAR(255) NOT NULL,
    descricao   NVARCHAR(255) NULL,
    created_at  DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- ============= HISTORICO_TREINO (execuções) =============
CREATE TABLE historico_treinos (
    id_historico_treino BIGINT IDENTITY(1,1) PRIMARY KEY,
    data         DATE          NOT NULL,
    tempo        DECIMAL(8,2)  NOT NULL,   -- minutos totais
    v_media      DECIMAL(8,2)  NOT NULL,   -- km/h
    distancia    DECIMAL(8,2)  NOT NULL,   -- km
    kcal         DECIMAL(8,2)  NOT NULL,   -- sobe p/ evitar overflow
    pace         DECIMAL(5,2)  NOT NULL,   -- min/km
    usuario_id   BIGINT        NOT NULL,
    treino_id    BIGINT        NULL,
    created_at   DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_hist_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_hist_treino  FOREIGN KEY (treino_id)  REFERENCES treino(id_treino)
);
GO
CREATE INDEX ix_hist_usuario ON historico_treino(usuario_id);
CREATE INDEX ix_hist_data    ON historico_treino(data);

-- ============= PONTOS GPS =============
CREATE TABLE treinos_pontos_gps (
    id_ponto              BIGINT IDENTITY(1,1) PRIMARY KEY,
    historico_treino_id   BIGINT        NOT NULL,
    latitude              DECIMAL(9,6)  NOT NULL,
    longitude             DECIMAL(9,6)  NOT NULL,
    momento               DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_ponto_hist FOREIGN KEY (historico_treino_id) REFERENCES historico_treino(id_historico_treino)
);
GO
CREATE INDEX ix_ponto_hist ON treino_pontos_gps(historico_treino_id);

-- ============= EVENTOS =============
CREATE TABLE eventos (
    id_evento      BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome           NVARCHAR(255) NOT NULL,
    descricao      NVARCHAR(255) NOT NULL,
    link_evento    NVARCHAR(255) NOT NULL,
    data_evento    DATE          NULL,
    imagem_evento  NVARCHAR(255) NULL,
    created_at     DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO
CREATE INDEX ix_evento_data ON eventos(data_evento);

-- ============= TOKENS (auth) =============
CREATE TABLE tokens (
    id           BIGINT IDENTITY(1,1) PRIMARY KEY,
    token        VARCHAR(255) NOT NULL UNIQUE,
    token_type   VARCHAR(30)  NOT NULL,   -- 'BEARER'
    revoked      BIT NOT NULL DEFAULT 0,
    expired      BIT NOT NULL DEFAULT 0,
    usuario_id   BIGINT NOT NULL,
    CONSTRAINT fk_token_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
);
GO


USE jornada_ativa;
GO



