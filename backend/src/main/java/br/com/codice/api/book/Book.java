package br.com.codice.api.book;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String slug;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String authors;

    @Column(length = 200)
    private String publisher;

    @Column(name = "publication_year")
    private Short publicationYear;

    @Column(length = 50)
    private String edition;

    @Column(nullable = false, length = 10)
    private String language = "pt-BR";

    @Column(length = 20)
    private String isbn;

    @Column(length = 200)
    private String translator;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "academic_areas", columnDefinition = "text[]")
    private String[] academicAreas = {};

    @Column(columnDefinition = "text")
    private String synopsis;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "search_vector", columnDefinition = "tsvector", insertable = false, updatable = false)
    private Object searchVector;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected Book() {
    }

    public Book(String slug, String title, String authors, String publisher,
                Short publicationYear, String edition, String language,
                String isbn, String translator, String[] academicAreas,
                String synopsis, String coverImageUrl) {
        this.slug = slug;
        this.title = title;
        this.authors = authors;
        this.publisher = publisher;
        this.publicationYear = publicationYear;
        this.edition = edition;
        this.language = language;
        this.isbn = isbn;
        this.translator = translator;
        this.academicAreas = academicAreas != null ? academicAreas : new String[]{};
        this.synopsis = synopsis;
        this.coverImageUrl = coverImageUrl;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthors() {
        return authors;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Short getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Short publicationYear) {
        this.publicationYear = publicationYear;
    }

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getTranslator() {
        return translator;
    }

    public void setTranslator(String translator) {
        this.translator = translator;
    }

    public String[] getAcademicAreas() {
        return academicAreas;
    }

    public void setAcademicAreas(String[] academicAreas) {
        this.academicAreas = academicAreas;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Book book = (Book) o;
        return id != null && Objects.equals(id, book.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
