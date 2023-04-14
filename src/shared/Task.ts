import { Entity, FieldOptions, Fields } from 'remult'

function checkedString(options?: FieldOptions) {
  return Fields.string({
    ...options,
    validate(entity, fieldRef) {
      if (typeof fieldRef.value !== 'string') {
        throw fieldRef.metadata.key + ' should be a string'
      }
      if (options) {
        if (Array.isArray(options.validate)) {
          for (const v of options.validate) {
            v(entity, fieldRef)
          }
        } else if (options.validate) {
          options.validate(entity, fieldRef)
        }
      }
    }
  })
}

@Entity('tasks', { allowApiCrud: true })
export class Task {
  @Fields.autoIncrement()
  id = 0

  @Fields.string()
  title = ''

  @Fields.boolean()
  completed = false

  // used @checkedString() for type validation
  @Fields.string()
  shouldBeString = ''
}
