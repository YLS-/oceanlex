// Nest
import { Injectable } from '@nestjs/common'

// DB
import { db, words } from '@oceanlex/db'

@Injectable()
export class WordsService {

	public list() {
		const w = db.select().from(words).limit(100)
		// console.dir(w, { depth: null, colors: true })
		return w
	}

}
