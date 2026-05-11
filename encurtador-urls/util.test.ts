// util.test.ts
import { expect, test, describe } from "bun:test";
import { gerarCodigo, urlValida, codigoValido } from "./util";

describe("gerarCodigo", () => {
  test("gera com 6 caracteres por padrão", () => {
    expect(gerarCodigo()).toHaveLength(6);
  });

  test("gera com tamanho customizado", () => {
    expect(gerarCodigo(10)).toHaveLength(10);
  });

  test("gera apenas caracteres alfanuméricos", () => {
    const codigo = gerarCodigo(100);
    expect(/^[A-Za-z0-9]+$/.test(codigo)).toBe(true);
  });
});

describe("urlValida", () => {
  test("aceita https", () => {
    expect(urlValida("https://ifes.edu.br")).toBe(true);
  });

  test("aceita http", () => {
    expect(urlValida("http://exemplo.com")).toBe(true);
  });

  test("rejeita string aleatória", () => {
    expect(urlValida("abc")).toBe(false);
  });

  test("rejeita ftp://", () => {
    expect(urlValida("ftp://arquivo.zip")).toBe(false);
  });

  test("rejeita string vazia", () => {
    expect(urlValida("")).toBe(false);
  });
});

describe("codigoValido", () => {
  test("aceita código alfanumérico de 6 chars", () => {
    expect(codigoValido("abc123")).toBe(true);
  });

  test("aceita código com 4 chars (mínimo)", () => {
    expect(codigoValido("abcd")).toBe(true);
  });

  test("aceita código com 10 chars (máximo)", () => {
    expect(codigoValido("abcde12345")).toBe(true);
  });

  test("rejeita código com 3 chars (muito curto)", () => {
    expect(codigoValido("abc")).toBe(false);
  });

  test("rejeita código com 11 chars (muito longo)", () => {
    expect(codigoValido("abcde123456")).toBe(false);
  });

  test("rejeita código com caracteres especiais", () => {
    expect(codigoValido("abc-123")).toBe(false);
  });

  test("rejeita código com espaço", () => {
    expect(codigoValido("abc 12")).toBe(false);
  });
});
