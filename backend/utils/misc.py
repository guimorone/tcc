import re
from io import BytesIO
from base64 import b64encode
from typing import List, Optional, Literal, Tuple
from PIL import Image, ImageDraw
from PyMultiDictionary import MultiDictionary


def ignore_word(word: str) -> bool:
    return any(char.isdigit() for char in word) or re.match(
        r'((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z]){2,6}([a-zA-Z0-9\.\&\/\?\:@\-_=#])*', word
    )


def check_if_word_is_correct(
    word: str,
    language: str,
    custom_dict: Optional[List[str]],
    dict_usage_type: Literal['complement', 'replacement'],
    ignore_words: List[str] = [],
) -> bool:
    word = word.strip().lower()
    if not word or word in ignore_words or ignore_word(word):
        return True

    # double check if we ignore the word after regex sub
    word = re.sub(r'[^\w\s$]|[\dº]', '', word)
    if not word or word in ignore_words or ignore_word(word):
        return True

    dictionary = MultiDictionary()
    dictionary.set_words_lang(language)
    # Classification = [Noun, Verb, Adjective, etc].
    if custom_dict and len(custom_dict) > 0:
        if word in custom_dict:
            return True

        if dict_usage_type == 'complement':
            classification, _, _ = dictionary.meaning(language, word)
            if classification and len(classification) > 0:
                return True
    else:
        classification, _, _ = dictionary.meaning(language, word)
        if classification and len(classification) > 0:
            return True

    return False


def draw_missing_words(
    image: Image,
    bounds: List[List[Tuple[float, float]]],
    image_format: str = 'PNG',
    fill: Optional[str] = None,
    outline: Optional[str] = 'red',
    outline_width: int = 2,
) -> Optional[bytes]:
    offset = 3
    try:
        draw = ImageDraw.Draw(image)
        for vertices in bounds:
            width, height = image.size
            if len(vertices) != 4:
                continue
            # top-left corner
            x1, y1 = vertices[0]
            if x1 > offset:
                x1 -= offset
            if y1 > offset:
                y1 -= offset
            # bottom-right corner
            x2, y2 = vertices[2]
            if x2 < width - offset:
                x2 += offset
            if y2 < height - offset:
                y2 += offset
            draw.rectangle([x1, y1, x2, y2], fill=fill, outline=outline, width=outline_width)

        buffer = BytesIO()
        image.save(buffer, format=image_format)

        return b64encode(buffer.getvalue())
    except:
        return None
