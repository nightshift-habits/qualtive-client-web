BUILD_TEMP_FILE_NAME="./build-temp-css-${RANDOM}"
FILES="./src/form/*.scss"
TEMP_OUTPUT_FILE="./temp-css-${RANDOM}"
OUTPUT_FILE="./src/form/styles.ts"

# Encode output prefix
echo "export const _styles = {" > $TEMP_OUTPUT_FILE

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
    echo "  $NAME: '$(cat "$BUILD_TEMP_FILE_NAME")'," >> $TEMP_OUTPUT_FILE
done

# Encode output suffix
echo "}" >> $TEMP_OUTPUT_FILE

# Move temp output to final destination
mv -f "$TEMP_OUTPUT_FILE" "$OUTPUT_FILE"

# Cleanup temp files
rm $BUILD_TEMP_FILE_NAME || true
