export function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function inferSchema(data: Record<string, string>[]): Record<string, string> | null {
  if (!data || data.length === 0) {
    return null;
  }
  const schema: Record<string, string> = {};
  data.map((item) => {
    Object.keys(item).map((key) => {
      if (!schema.hasOwnProperty(key)) {
        if (!isNaN(parseFloat(item[key]))) {
          schema[key] = typeof parseFloat(item[key]) === 'number' ? 'number' : 'string';
        } else {
          schema[key] = 'string';
        }
      } else if (typeof item[key] !== schema[key]) {
        schema[key] = 'mixed';
      }
    });
  });
  return schema;
}
