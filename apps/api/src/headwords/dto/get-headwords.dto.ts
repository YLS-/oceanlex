import { IsIn, IsInt, IsOptional, IsString, MinLength, Min, Max } from 'class-validator'
import { LANGUAGE_CODES, type LanguageCode } from '@oceanlex/models'
import { Transform, Type } from 'class-transformer'


export class GetHeadwordsDto {

	/** Target headword language */
	@IsIn(LANGUAGE_CODES, { message: 'Invalid target language' })
	public lang!: LanguageCode

	/** Headword search query */
	@IsString({ message: 'Query must be a string' })
	@MinLength(1, { message: 'Query must be at least 1 character' })
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	public query!: string

	/** Maximum number of headwords to return */
	@IsOptional()
	@Type(() => Number)		// coerce query param (string) to number
	@IsInt({ message: 'Limit must be an integer' })
	@Min(1, { message: 'Limit must be at least 1' })
	@Max(50, { message: 'Limit must be less than or equal to 50' })
	public limit: number = 10

}
