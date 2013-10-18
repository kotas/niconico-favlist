/// <reference path="./identifier.ts" />

interface Entity<ID extends Identifier> {
    getId(): ID;
}
