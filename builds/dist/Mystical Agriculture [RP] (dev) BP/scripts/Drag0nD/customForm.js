import { ActionFormData } from '@minecraft/server-ui';

class CustomForm {
  categories = new Map();
  titleText = "";
  bodytext = "";

  title(title) {
    this.titleText = title;
    return this;
  }

  body(txt) {
    this.bodytext = txt;
    return this;
  }

  button(category, text, texture = "", enchanted = false) {
    if (this.categories.has(category)) {
      this.categories.get(category).push({ "text": text, "texture": texture, "enchanted": enchanted });
    } else {
      this.categories.set(category, [{ "text": text, "texture": texture, "enchanted": enchanted }]);
    }
    return this;
  }

  getKeyAtIndex(index) {
    const keysArray = Array.from(this.categories.keys());
    if (index >= 0 && index < keysArray.length) {
      return keysArray[index];
    } else {
      console.error('Index out of bounds.');
      return null;
    }
  }

  show(player, category = this.getKeyAtIndex(0)) {
    let actionform = new ActionFormData();
    let finalTitle = "§c§u§s§t§o§m§r" + this.titleText;
    actionform.title(finalTitle);

    let buttons = this.categories.get(category);
    if (buttons) {
      for (const txt of buttons) {
        actionform.button(txt.text, txt.texture);
      }
    }

    for (let i = 0; i < this.categories.size; i++) {
      actionform.button(`§c§a§t§e§g§o§r§y§8 ${this.getKeyAtIndex(i)}`);
    }

    let fillertxt = "";
    let catesizetxt = JSON.stringify(this.categories.size).length;
    catesizetxt = catesizetxt % 2 == 0 ? catesizetxt : catesizetxt + 1;
    for (let i = catesizetxt; i <= 10; i++) {
      fillertxt += "]";
    }

    let finalbodytxt = JSON.stringify(this.categories.size) + fillertxt + this.bodytext;
    actionform.body(finalbodytxt);

    return actionform.show(player).then(response => {
      if (!response) {
        return;
      }
      let index = buttons ? buttons.length : 0;
      let maxIndex = index + this.categories.size;

      if (response.selection >= index && response.selection < maxIndex) {
        return this.show(player, this.getKeyAtIndex(response.selection - index));
      }
      if (buttons && response.selection < buttons.length) {
        response.text = buttons[response.selection].text;
      }
      response.category = category;

      return response;
    });
  }
}

export { CustomForm };