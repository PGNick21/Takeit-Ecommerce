export const emailValidator = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const passwordValidator = (password: string): boolean => {
    return password.length >= 6
  }
  
  export const requiredValidator = (value: any): boolean => {
    return !!value
  }