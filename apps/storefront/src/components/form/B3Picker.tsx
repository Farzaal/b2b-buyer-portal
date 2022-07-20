import {
  TextField,
  FormControl,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { useB3Lang } from '@b3/lang'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Form from './ui'

export const B3Picker = ({ control, errors, ...rest } : Form.B3UIProps) => {
  const {
    fieldType, name, default: defaultValue, required, label, validate, muiTextFieldProps,
  } = rest

  const b3Lang = useB3Lang()

  const fieldsProps = {
    type: fieldType,
    name,
    key: name,
    defaultValue,
    rules: {
      required: required && b3Lang('intl.global.validate.required', { label }),
      validate: validate && ((v: string) => validate(v, b3Lang)),
    },
    control,
  }

  const muixPickerProps = muiTextFieldProps || {}

  return (
    <>
      {
        ['date'].includes(fieldType) && (
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                {...fieldsProps}
                render={({ field: { ref, ...rest } }) => (
                  <DesktopDatePicker
                    label={label}
                    inputFormat="MM/dd/yyyy"
                    {...muixPickerProps}
                    renderInput={(params) => <TextField {...params} />}
                    {...rest}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
        )
      }
    </>
  )
}
