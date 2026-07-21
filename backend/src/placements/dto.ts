import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreatePlacementDto {
  @IsString()
  title!: string;

  @IsString()
  pageKey!: string;

  @IsString()
  slotKey!: string;

  @IsString()
  targetType!: string;

  @IsString()
  targetId!: string;

  @IsOptional()
  @IsString()
  variant?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  visibleFrom?: string;

  @IsOptional()
  @IsString()
  visibleUntil?: string;
}

export class UpdatePlacementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  pageKey?: string;

  @IsOptional()
  @IsString()
  slotKey?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsString()
  variant?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  visibleFrom?: string;

  @IsOptional()
  @IsString()
  visibleUntil?: string;
}
