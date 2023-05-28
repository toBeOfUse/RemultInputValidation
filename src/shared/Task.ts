import { Entity, FieldOptions, Fields, Validators } from 'remult'

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
  @Fields.cuid()
  id: string = ''

  @Fields.string()
  title = ''

  @Fields.boolean()
  completed = false

  @Fields.number({ allowNull: false })
  shouldBeNum: number = 5
}
