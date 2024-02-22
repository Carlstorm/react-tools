export const getBounding = (obj: any) => {
    const { viewBox } = obj.svg["$"]
    const [x1, y1, x2, y2] = viewBox.split(" ").map((val: string) => eval(val))
    return {
        width: -x1+x2,
        height: -y1+y2
    }
}

export const validateComponentName = (name: string, returnAutoFix?: boolean) => {
  // Remove file extension (.svg)
  const fileNameWithoutExtension = name.replace(/\.svg$/, '');

  // Remove non-alphanumeric characters
  const cleanedName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9-_]/g, '');

  // Ensure the resulting name starts with a letter
  const validName = cleanedName.length > 0 ? cleanedName : 'SvgIcon';

  // Capitalize the first letter of each word and join them
  const formattedName = validName
    .split(/[-_]/)  // Split by hyphens or underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return formattedName;
}