/**
 * Структурированные данные schema.org. Обычный <script>, а не next/script:
 * это данные, а не исполняемый код. «<» экранируем — иначе строка вида
 * «</script>» внутри значения закрыла бы тег раньше времени.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
