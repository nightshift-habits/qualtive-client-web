BUILD_TEMP_FILE_NAME="./build-temp-css"
FILES="./src/form/*.scss"
OUTPUT_FILE="./src/form/styles.ts"

# Encode output prefix
echo "export const _styles = {" > $OUTPUT_FILE

# Enumearte all scss-fiels
for FILE in $FILES; do
  
    # Build
    ./node_modules/.bin/sass \
        --no-source-map \
        --style compressed \
        "$FILE" \
        "$BUILD_TEMP_FILE_NAME"

    # Parse file name without extension
    FILENAME=$(basename -- "$FILE")
    NAME="${FILENAME%.*}"

    # Encode
    echo "  $NAME: '$(cat "$BUILD_TEMP_FILE_NAME")'," >> $OUTPUT_FILE
done

# Encode output suffix
echo "}" >> $OUTPUT_FILE

# Cleanup temp files
rm $BUILD_TEMP_FILE_NAME || true
