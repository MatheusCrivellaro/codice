---
description: Convenções de backend Java/Spring do Códice
paths:
  - "backend/src/main/java/**/*.java"
  - "backend/pom.xml"
---

# Backend — Java + Spring Boot

Estado atual e stack: `codice-technical-reference.md` §2, §3, §5. Não duplique aqui.

## Package e estrutura

Package base: `br.com.codice.api`. Organização **por feature**, não por camada. Cada feature tem seu próprio diretório com `Entity`, `Repository`, `Controller`, `Service` (quando necessário) e subpasta `dto/`. Não crie pastas `controllers/`, `services/`, `repositories/` na raiz.

Features existentes: `auth`, `user`, `book`, `seller`, `listing`, `lookup`, `interest`, `storage`, `admin`, `common`, `config`. Para adicionar feature nova, siga o mesmo padrão de uma existente (ex: `listing/`).

## DTOs

**Sempre records.** Nada de classe DTO com getter/setter.

```java
public record ListingResponse(
    UUID id,
    UUID bookId,
    Integer priceCents,
    String condition,
    String status
) {}
```

Validação no record via anotações nos parâmetros:

```java
public record CreateListingRequest(
    @NotNull UUID bookId,
    @Positive Integer priceCents,
    @NotBlank @Size(max = 2000) String description
) {}
```

DTOs sempre em subpasta `dto/` da feature, nunca no mesmo pacote da entity.

## Injeção

**Constructor injection.** Nunca `@Autowired` em campo, nunca `@Autowired` no construtor (redundante desde Spring 4.3).

```java
@RestController
@RequestMapping("/listings")
public class ListingController {
    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }
}
```

Sem Lombok. Sem `@RequiredArgsConstructor`. Sem `@Data`.

## Controllers

Controllers finos. Validação com `@Valid`, delegam para service. Não fazem query nem contêm regra de negócio. Exceções sobem — o `common/GlobalExceptionHandler` cuida.

```java
@PostMapping
public ResponseEntity<ListingResponse> create(
    @Valid @RequestBody CreateListingRequest request,
    @AuthenticationPrincipal UserPrincipal principal
) {
    var response = listingService.create(request, principal.userId());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

Rotas em kebab-case no path (`/interests/unread-count`), camelCase em query params.

## Services e transações

`@Transactional` no service. Nunca no controller, nunca no repository.

Leitura pura: `@Transactional(readOnly = true)`. Escrita: `@Transactional`. Se o método não toca banco, sem anotação.

## Tratamento de erro

Lance exceção do domínio, não `ResponseEntity` com erro. `GlobalExceptionHandler` traduz para resposta HTTP.

Tipos já cobertos: `MethodArgumentNotValidException` (400), `ResponseStatusException` (status custom), `AccessDeniedException` (403). Para erro novo, prefira `ResponseStatusException` com mensagem clara em vez de criar classe de exceção nova.

## Segurança

JWT via `auth/jwt/JwtAuthenticationFilter`. Rotas públicas configuradas em `config/SecurityConfig`. Para proteger rota nova, adicione em `SecurityConfig` — nunca use `@PreAuthorize` sem antes consultar.

Recuperar user logado no controller: `@AuthenticationPrincipal`. Nunca leia o token direto.

## Persistência

JPA/Hibernate com `ddl-auto: validate`. **Mudança de schema é migration** (ver `migrations.md`).

Entity em `FeatureName.java`, repository em `FeatureNameRepository.java` extendendo `JpaRepository<Entity, UUID>`. IDs são UUID gerados via `gen_random_uuid()` na migration, não `GenerationType.AUTO`.

Preços em `Integer priceCents`. Nunca `BigDecimal`, nunca `double`.

Enums Java como `VARCHAR` no banco, mapeados via `@Enumerated(EnumType.STRING)`.

## Validação

Jakarta Bean Validation. Anotações nos records de DTO. Mensagens em português quando visíveis ao usuário:

```java
@Size(min = 8, message = "A senha precisa ter ao menos 8 caracteres")
```

## HTTP client

`Spring RestClient` (já em uso em `lookup/client/`). Não adicione WebClient, OkHttp, Apache HttpClient. Cache com Caffeine quando couber (ver `BookLookupService`).

## Fora deste arquivo

Migrations, triggers, índices: `migrations.md`. Seed: `seed.md`. Testes manuais `.http`: `http-tests.md`.
