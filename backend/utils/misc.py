import re


def ignore_word(word: str) -> bool:
    return any(char.isdigit() for char in word) or re.match(
        r'((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z]){2,6}([a-zA-Z0-9\.\&\/\?\:@\-_=#])*', word
    )
