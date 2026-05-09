  DROP TYPE IF EXISTS genere_enum CASCADE;
  CREATE TYPE genere_enum_new AS ENUM (
    'M',
    'F',
    'altre'
  );

  CREATE TABLE usuaris (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(255),
    cognoms VARCHAR(255),
    mote VARCHAR(255),

    email VARCHAR(255) UNIQUE NOT NULL,
    contrasenya VARCHAR(255) NOT NULL,
    telefon VARCHAR(255),

    altura_total INT CHECK (altura_total > 0),
    altura_espatlles INT CHECK (altura_espatlles > 0),
    envergadura INT CHECK (envergadura > 0),
    pes INT CHECK (pes > 0),

    url_foto VARCHAR(255),

    lesionat BOOLEAN DEFAULT FALSE,
    data_lesio TIMESTAMPTZ,

    canalla BOOLEAN DEFAULT FALSE,
    genere genere_enum_new,

    comentari TEXT,

    data_creacio TIMESTAMPTZ DEFAULT now(),
    data_actualitzacio TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE rols (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    descripcio VARCHAR(255),
    permisos JSONB NOT NULL DEFAULT '{}'

    id_colla BIGINT NOT NULL,

    FOREIGN KEY (id_colla)
    REFERENCES colles(id)
    ON DELETE CASCADE,

    UNIQUE (nom, id_colla)
  );

  CREATE TABLE colles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    abreviacio VARCHAR(255),
    adreca VARCHAR(255),
    poblacio VARCHAR(255),
    telefon VARCHAR(255),
    url_logo VARCHAR(255),
    correus_contacte VARCHAR(255),

    data_creacio TIMESTAMPTZ DEFAULT now(),
    data_actualitzacio TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE membres_colla (
    id_usuari BIGINT NOT NULL,
    id_colla BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,

    actiu BOOLEAN DEFAULT TRUE,
    data_acces TIMESTAMPTZ DEFAULT now(),

    PRIMARY KEY (id_usuari, id_colla),

    FOREIGN KEY (id_usuari)
      REFERENCES usuaris(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_colla)
      REFERENCES colles(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_rol)
      REFERENCES rols(id)
      ON DELETE RESTRICT
  );

  CREATE INDEX idx_membres_colla_usuari ON membres_colla(id_usuari);
  CREATE INDEX idx_membres_colla_colla ON membres_colla(id_colla);

  CREATE TABLE posicions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    descripcio VARCHAR(255),

    id_colla BIGINT NOT NULL,

    FOREIGN KEY (id_colla)
    REFERENCES colles(id)
    ON DELETE CASCADE,

    UNIQUE (nom, id_colla)
  );

  CREATE TABLE posicio_usuari (
    id_usuari BIGINT NOT NULL,
    id_posicio BIGINT NOT NULL,

    PRIMARY KEY (id_usuari, id_posicio),

    FOREIGN KEY (id_usuari)
      REFERENCES usuaris(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_posicio)
      REFERENCES posicions(id)
      ON DELETE CASCADE
  );

  CREATE TABLE grups (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    descripcio VARCHAR(255)

    id_colla BIGINT NOT NULL,

    FOREIGN KEY (id_colla)
    REFERENCES colles(id)
    ON DELETE CASCADE,

    UNIQUE (nom, id_colla)
  );

  CREATE TABLE grup_usuari (
    id_usuari BIGINT NOT NULL,
    id_grup BIGINT NOT NULL,

    PRIMARY KEY (id_usuari, id_grup),

    FOREIGN KEY (id_usuari)
      REFERENCES usuaris(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_grup)
      REFERENCES grups(id)
      ON DELETE CASCADE
  );

  CREATE TABLE esdeveniments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_colla BIGINT NOT NULL,

    nom VARCHAR(255) NOT NULL,
    tipus VARCHAR(255) NOT NULL,

    data_esdeveniment TIMESTAMPTZ NOT NULL,
    hora TIME NOT NULL,
    duracio INT CHECK (duracio > 0),

    adreca VARCHAR(255),
    link_adreca VARCHAR(255),

    visible BOOLEAN DEFAULT TRUE,
    acompanyat BOOLEAN DEFAULT FALSE,
    bus BOOLEAN DEFAULT FALSE,

    data_inici_inscripcions TIMESTAMPTZ,
    info_addicional TEXT,

    codi_confirmacio VARCHAR(255),

    data_creacio TIMESTAMPTZ DEFAULT now(),
    data_actualitzacio TIMESTAMPTZ DEFAULT now(),

    FOREIGN KEY (id_colla)
      REFERENCES colles(id)
      ON DELETE CASCADE
  );

  CREATE INDEX idx_esdeveniments_colla ON esdeveniments(id_colla);

  DROP TYPE IF EXISTS confirmacio_enum CASCADE;

  CREATE TYPE confirmacio_enum AS ENUM (
    'pendent',
    'si',
    'no',
    'no_sap'
  );

  CREATE TABLE assistencia (
    id BIGSERIAL PRIMARY KEY,
    id_esdeveniment BIGINT NOT NULL,
    id_usuari BIGINT NOT NULL,

    confirmacio_previa confirmacio_enum,
    confirmacio_arribada confirmacio_enum,

    comentari TEXT,

    num_acompanyants INT DEFAULT 0 CHECK (num_acompanyants >= 0),

    arriba_tard BOOLEAN DEFAULT FALSE,
    marxa_aviat BOOLEAN DEFAULT FALSE,
    bus BOOLEAN DEFAULT FALSE,

    data_creacio TIMESTAMPTZ DEFAULT now(),
    data_actualitzacio TIMESTAMPTZ DEFAULT now(),

    temps_tard INT DEFAULT 0 CHECK (temps_tard >= 0),
    temps_aviat INT DEFAULT 0 CHECK (temps_aviat >= 0),

    UNIQUE (id_usuari, id_esdeveniment),

    FOREIGN KEY (id_esdeveniment)
      REFERENCES esdeveniments(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_usuari)
      REFERENCES usuaris(id)
      ON DELETE CASCADE
  );

  CREATE INDEX idx_assistencia_esdeveniment ON assistencia(id_esdeveniment);

  CREATE TABLE notificacions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titol VARCHAR(255) NOT NULL,
    missatge VARCHAR(255),

    data_creacio TIMESTAMPTZ DEFAULT now(),
    data_programacio TIMESTAMPTZ
  );

  CREATE TABLE receptors_notificacions (
    id_notificacio BIGINT NOT NULL,
    id_grup BIGINT NOT NULL,

    vist BOOLEAN DEFAULT FALSE,
    data_vista TIMESTAMPTZ,

    PRIMARY KEY (id_notificacio, id_grup),

    FOREIGN KEY (id_notificacio)
      REFERENCES notificacions(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_grup)
      REFERENCES grups(id)
      ON DELETE CASCADE
  );

  CREATE TABLE proves (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_esdeveniment BIGINT NOT NULL,

    nom VARCHAR(255) NOT NULL,
    comentari TEXT,

    favorita BOOLEAN DEFAULT FALSE,
    public BOOLEAN DEFAULT FALSE,
    xarxa BOOLEAN DEFAULT FALSE,

    estructura VARCHAR(255),
    indicacions JSONB NOT NULL DEFAULT '{}',

    data_creacio TIMESTAMPTZ DEFAULT now(),
    data_actualitzacio TIMESTAMPTZ DEFAULT now(),

    FOREIGN KEY (id_esdeveniment)
      REFERENCES esdeveniments(id)
      ON DELETE CASCADE
  );

  CREATE INDEX idx_proves_esdeveniment ON proves(id_esdeveniment);

  CREATE TABLE plantilles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    descripcio VARCHAR(255),

    favorita BOOLEAN DEFAULT FALSE,
    estructura VARCHAR(255),

    id_colla BIGINT NOT NULL,

    pinya BOOLEAN NOT NULL DEFAULT TRUE,
    tronc BOOLEAN NOT NULL DEFAULT TRUE,
    folre BOOLEAN NOT NULL DEFAULT FALSE,
    manilles BOOLEAN NOT NULL DEFAULT FALSE,
    puntals BOOLEAN NOT NULL DEFAULT FALSE;

    data_creacio TIMESTAMPTZ DEFAULT now(),
    data_actualitzacio TIMESTAMPTZ DEFAULT now()

    CONSTRAINT fk_plantilles_colles
        FOREIGN KEY (id_colla)
        REFERENCES colles(id)
        ON DELETE CASCADE

    CONSTRAINT unique_nom_per_colla UNIQUE (nom, id_colla)
  );

  CREATE TABLE posicions_plantilla (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_plantilla BIGINT NOT NULL,

    nom VARCHAR(255) NOT NULL,
    color VARCHAR(255),

    coord_x INT,
    coord_y INT,
    rotacio INT,

    seccio VARCHAR(255),

    posicio_relacio BIGINT,

    FOREIGN KEY (id_plantilla)
      REFERENCES plantilles(id)
      ON DELETE CASCADE

    FOREIGN KEY (posicio_relacio)
      REFERENCES posicions_plantilla(id)
      ON DELETE CASCADE
  );

  CREATE TABLE assignacions_prova (
    id_assignacio BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prova BIGINT NOT NULL,
    id_posicio BIGINT NOT NULL,
    id_usuari BIGINT NOT NULL,

    data_assignacio TIMESTAMPTZ DEFAULT now(),

    FOREIGN KEY (id_prova)
      REFERENCES proves(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_posicio)
      REFERENCES posicions_plantilla(id)
      ON DELETE CASCADE,

    FOREIGN KEY (id_usuari)
      REFERENCES usuaris(id)
      ON DELETE CASCADE
  );

  CREATE INDEX idx_assignacions_prova
    ON assignacions_prova(id_prova, id_posicio, id_usuari);