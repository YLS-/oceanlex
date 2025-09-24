// Nest DTO
import { IsIn, IsInt, IsOptional, IsString, MinLength, Min, Max } from 'class-validator'
import { Transform, Type } from 'class-transformer'

// Oceanlex models
import { LANGUAGE_CODES, type LanguageCode } from '@oceanlex/models'
import { HEADWORDS_SEARCH_MODES, type HeadwordsSearchMode, type HeadwordsSearchQuery } from '@oceanlex/transport'


export class GetHeadwordsDto implements HeadwordsSearchQuery {

	/** Source headword language */
	@IsIn(LANGUAGE_CODES, { message: 'Invalid source language' })
	public sl!: LanguageCode

	/** Target headword language */
	@IsIn(LANGUAGE_CODES, { message: 'Invalid target language' })
	public tl!: LanguageCode

	/** Headword search query */
	@IsString({ message: 'Query must be a string' })
	@MinLength(1, { message: 'Query must be at least 1 character' })
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	public query!: string

	/** Mode of headword search */
	@IsOptional()
	@IsString({ message: 'Search mode must be a string' })
	@IsIn(HEADWORDS_SEARCH_MODES, { message: 'Invalid search mode' })
	public mode: HeadwordsSearchMode = 'after'

	/** Maximum number of headwords to return */
	@IsOptional()
	@Type(() => Number)		// coerce query param (string) to number
	@IsInt({ message: 'Limit must be an integer' })
	@Min(1, { message: 'Limit must be at least 1' })
	@Max(50, { message: 'Limit must be less than or equal to 50' })
	public limit: number = 10

}
