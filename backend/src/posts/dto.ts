import { IsArray, IsIn, IsObject, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  templateKey!: string;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: string;

  @IsOptional()
  @IsString()
  eyebrow?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsObject()
  body?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  coverImageId?: string;

  @IsOptional()
  @IsArray()
  gallery?: unknown[];

  @IsOptional()
  @IsObject()
  cta?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  publishedAt?: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  templateKey?: string;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: string;

  @IsOptional()
  @IsString()
  eyebrow?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsObject()
  body?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  coverImageId?: string;

  @IsOptional()
  @IsArray()
  gallery?: unknown[];

  @IsOptional()
  @IsObject()
  cta?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  publishedAt?: string;
}
