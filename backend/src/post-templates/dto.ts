import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePostTemplateDto {
  @IsString()
  key!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  defaultEyebrow?: string;

  @IsOptional()
  @IsString()
  defaultCtaLabel?: string;

  @IsOptional()
  @IsArray()
  recommendedSlots?: string[];

  @IsOptional()
  @IsString()
  previewKind?: string;

  @IsOptional()
  @IsArray()
  blockOrder?: string[];

  @IsOptional()
  @IsString()
  editorGuidance?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdatePostTemplateDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  defaultEyebrow?: string;

  @IsOptional()
  @IsString()
  defaultCtaLabel?: string;

  @IsOptional()
  @IsArray()
  recommendedSlots?: string[];

  @IsOptional()
  @IsString()
  previewKind?: string;

  @IsOptional()
  @IsArray()
  blockOrder?: string[];

  @IsOptional()
  @IsString()
  editorGuidance?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
