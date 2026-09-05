# auth.md — JOYJOS Agent Registration & Authentication

Documentación oficial y especificación de acceso para Agentes de Inteligencia Artificial en **JOYJOS** (https://joyjos.eu), conforme al estándar [Auth.md](https://workos.com/auth-md).

---

## 1. Audiencia y Propósito

Este documento establece los mecanismos mediante los cuales agentes autónomos de IA, crawlers semánticos y sistemas de orquestación pueden autenticarse, registrarse programáticamente y acceder a los recursos de JOYJOS de forma segura y transparente.

- **Servicio**: JOYJOS — Servicios de Automatización de Procesos e Inteligencia Artificial
- **Identificador de Recurso**: `https://joyjos.eu`
- **Servidor de Autorización**: `https://joyjos.eu`
- **Contacto de Seguridad**: `hola@joyjos.eu`

---

## 2. Metadatos de Descubrimiento OAuth y OIDC

JOYJOS publica metadatos estándar de autenticación en las siguientes ubicaciones:

- **OAuth Protected Resource Metadata (RFC 9728)**: `/.well-known/oauth-protected-resource`
- **OAuth Authorization Server Metadata (RFC 8414)**: `/.well-known/oauth-authorization-server`
- **OpenID Connect Discovery**: `/.well-known/openid-configuration`
- **JSON Web Key Set (JWKS)**: `/.well-known/jwks.json`

---

## 3. Métodos de Registro y Autenticación Soportados

Los agentes pueden registrarse o identificarse a través del endpoint de registro:
- **Registration Endpoint**: `POST https://joyjos.eu/agent/auth`
- **Skill Discovery**: `https://joyjos.eu/.well-known/agent-skills/joyjos-consulting/SKILL.md`

### 3.1. Modo Anónimo (Anonymous)
- **Identity Type**: `anonymous`
- **Credential Type**: `bearer_token`
- **Claim URI**: `https://joyjos.eu/agent/claim`
- **Alcance**: Acceso de solo lectura a catálogos públicos, información de servicios, precios orientativos y diagnóstico inicial.

### 3.2. Aserción de Identidad (Identity Assertion)
- **Identity Type**: `identity_assertion`
- **Assertion Types**:
  - `verified_email`: Verificación de identidad vinculada al correo de la empresa u operador del agente.
  - `urn:ietf:params:oauth:token-type:id-jag`: Token de aserción criptográfica entre agentes (Identity-JAG).
- **Credential Type**: `bearer_token`

---

## 4. Scopes y Permisos

| Scope | Descripción | Nivel de Acceso |
| :--- | :--- | :--- |
| `read` | Lectura de información de la agencia, servicios y casos de uso. | Público / Anónimo |
| `diagnostics` | Ejecución y simulación del test de viabilidad de automatizaciones. | Autenticado |
| `contact` | Envío automatizado de solicitudes de propuesta o agendado de cita. | Verificado |

---

## 5. Uso de Credenciales en Peticiones

Todas las llamadas de agentes autenticados deben incluir el token Bearer en la cabecera HTTP estándar:

```http
Authorization: Bearer <agent_access_token>
```

---

## 6. Políticas de Rate Limiting y Buen Uso

- **Límites**: Hasta 60 peticiones por minuto por agente en endpoints públicos.
- **Cache**: Respetar cabeceras `Cache-Control` y `ETag`.
- **User-Agent**: Se solicita a los agentes incluir una cadena de `User-Agent` descriptiva con contacto o URL (ejemplo: `AgentName/1.0 (+https://example.com/bot)`).
