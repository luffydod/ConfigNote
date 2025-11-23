#!/bin/bash

# Function to extract various archive formats
extract() {
    if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
        echo "Usage: extract <file> [destination]"
        echo "Extracts the archive <file> to the current directory or [destination]."
        echo "Supported formats: .tar.gz, .tgz, .tar.bz2, .tbz2, .tar.xz, .txz, .zip, .7z, .rar, .tar"
        return 0
    fi

    if [ -z "$1" ]; then
        echo "Error: No file specified."
        echo "Usage: extract <file> [destination]"
        return 1
    fi

    local file="$1"
    local dest="${2:-.}"

    if [ ! -f "$file" ]; then
        echo "Error: '$file' is not a valid file."
        return 1
    fi

    if [ ! -d "$dest" ]; then
        mkdir -p "$dest"
        echo "Created directory '$dest'."
    fi

    echo "Extracting '$file' to '$dest'..."

    case "$file" in
        *.tar.gz|*.tgz)
            tar xzf "$file" -C "$dest"
            ;;
        *.tar.bz2|*.tbz2)
            tar xjf "$file" -C "$dest"
            ;;
        *.tar.xz|*.txz)
            tar xJf "$file" -C "$dest"
            ;;
        *.zip)
            unzip "$file" -d "$dest"
            ;;
        *.7z)
            7z x "$file" -o"$dest"
            ;;
        *.rar)
            unrar x "$file" "$dest"
            ;;
        *.tar)
            tar xf "$file" -C "$dest"
            ;;
        *)
            echo "Error: Unsupported format for '$file'."
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        echo "Extraction complete."
    else
        echo "Error during extraction."
        return 1
    fi
}

# Function to compress files into various formats
compress() {
    if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
        echo "Usage: compress <output_file> <input_file1> [input_file2 ...]"
        echo "Compresses input files/directories into <output_file>."
        echo "Format is determined by the output file extension."
        echo "Supported extensions: .tar.gz, .tgz, .tar.bz2, .tbz2, .tar.xz, .txz, .zip, .7z, .tar"
        return 0
    fi

    if [ $# -lt 2 ]; then
        echo "Error: Insufficient arguments."
        echo "Usage: compress <output_file> <input_file1> [input_file2 ...]"
        return 1
    fi

    local output="$1"
    shift
    local inputs=("$@")

    echo "Compressing into '$output'..."

    case "$output" in
        *.tar.gz|*.tgz)
            tar czf "$output" "${inputs[@]}"
            ;;
        *.tar.bz2|*.tbz2)
            tar cjf "$output" "${inputs[@]}"
            ;;
        *.tar.xz|*.txz)
            tar cJf "$output" "${inputs[@]}"
            ;;
        *.zip)
            zip -r "$output" "${inputs[@]}"
            ;;
        *.7z)
            7z a "$output" "${inputs[@]}"
            ;;
        *.tar)
            tar cf "$output" "${inputs[@]}"
            ;;
        *)
            # Default to .tar if no known extension, or append .tar? 
            # User requested default to tar format.
            # If the user didn't provide an extension, we might want to append .tar
            # But here we are matching against the provided name.
            # Let's assume if it doesn't match others, we treat it as a tarball request 
            # but we should probably warn or append extension. 
            # However, standard behavior for 'compress filename folder' might be ambiguous without extension.
            # Let's stick to the user requirement: "Default can be compressed to tar format".
            # I will treat it as tar and append .tar if missing, or just create it as is?
            # Safer to just create as tar.
            echo "No extension detected or supported. Defaulting to TAR format."
            tar cf "$output" "${inputs[@]}"
            ;;
    esac

    if [ $? -eq 0 ]; then
        echo "Compression complete: $output"
    else
        echo "Error during compression."
        return 1
    fi
}
