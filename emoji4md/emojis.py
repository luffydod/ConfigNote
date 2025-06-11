from typing import List
import random

class Emoji4win11:
    HAPPY_EMOJIS = ['😀', '😁', '😂', '😃', '😄',
                '😅', '😆', '😇', '😉', '😊',
                '🙂', '🙃', '🤣', '🫠']
    
    LOVE_EMOJIS = ['☺️', '😍', '😗', '😘', '😙',
                '😚', '🤩', '🥰', '🥲']

    TONGUE_EMOJIS = ['😋', '😛', '😜', '😝', '🤑',
                    '🤪']

    HAND_EMOJIS = ['🤔', '🤗', '🤫', '🤭', '🫡',
                '🫢', '🫣']

    CALM_EMOJIS = ['😏', '😐', '😑', '😒', '😬',
                '😶','🙄', '🤐', '🤥', '🤨',
                '🫥', '🫨']

    SLEEPY_EMOJIS = ['😌', '😔', '😪', '😴', '🤤']

    SEEK_EMOJIS =  ['😵', '😷', '🤒', '🤕',
                    '🤢', '🤧', '🤮', '🤯', '🥴',
                    '🥵','🥶']
    
    HAT_EMOJIS = ['🤠', '🥳', '🥸']

    GLASS_EMOJIS = ['😎', '🤓', '🧐']

    WORRY_EMOJIS = ['☹️', '😓', '😕', '😖', '😞',
                    '😟', '😢', '😣', '😥', '😦',
                    '😧', '😨', '😩', '😫', '😭',
                    '😮', '😯', '😰', '😱', '😲',
                    '😳', '🙁', '🥱', '🥹', '🥺',
                    '🫤']

    ANGRY_EMOJIS = ['☠️', '👿', '💀', '😈', '😠',
                    '😡', '😤', '🤬']

    MONSTER_EMOJIS = ['👹', '👺', '👻', '👽', '👾',
                    '💩', '🤖', '🤡']

    CAT_EMOJIS = ['😸', '😹', '😺', '😻', '😼',
                '😽', '😾', '😿', '🙀']

    MONKEY_EMOJIS = ['🙈', '🙉', '🙊']

    def get_emoji(self, category) -> List[str]:
        """根据类别获取对应的 Emoji 列表"""
        emoji_dict = {
            'happy': self.HAPPY_EMOJIS,
            'love': self.LOVE_EMOJIS,
            'tongue': self.TONGUE_EMOJIS,
            'hand': self.HAND_EMOJIS,
            'calm': self.CALM_EMOJIS,
            'sleepy': self.SLEEPY_EMOJIS,
            'seek': self.SEEK_EMOJIS,
            'hat': self.HAT_EMOJIS,
            'glass': self.GLASS_EMOJIS,
            'worry': self.WORRY_EMOJIS,
            'angry': self.ANGRY_EMOJIS,
            'monster': self.MONSTER_EMOJIS,
            'cat': self.CAT_EMOJIS,
            'monkey': self.MONKEY_EMOJIS
        }
        return emoji_dict.get(category, [])
    
    def get_all_emojis(self)-> List[str]:
        """获取所有 Emoji"""
        all_emojis = []
        # 获取类的所有属性
        for category in dir(self.__class__):
            # 只处理以_EMOJIS结尾的类变量
            if category.endswith('_EMOJIS'):
                # 使用getattr获取类变量的值
                emoji_list = getattr(self, category)
                all_emojis.extend(emoji_list)
        return all_emojis
    
class Emoji:
    def __init__(self, emojis: List[str] =None, seed=None):
        if emojis:
            self.emojis = emojis
        else:
            # default with win11-emojis
            self.emojis = Emoji4win11().get_all_emojis()

        self.seed = seed

    def set_seed(self, seed: int) -> None:
        """设置随机种子"""
        self.seed = seed
        random.seed(seed)

    def get_emoji(self) -> str:
        """随机获取一个 Emoji"""
        assert self.emojis is not None, "Emoji list is not initialized."
        assert len(self.emojis) > 0, "Emoji list is empty."
        # 随机选择一个 Emoji
        emoji = random.choice(self.emojis)
        if self.seed is not None:
            random.seed(self.seed + 1)  # 增加种子以避免重复
        return emoji
    


if __name__ == '__main__':

    emoji = Emoji()
    print("随机 Emoji:", emoji.get_emoji())
    print("所有 Emoji:", emoji.emojis)