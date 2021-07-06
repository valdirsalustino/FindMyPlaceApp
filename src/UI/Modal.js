export class Modal {

	constructor(contentId, fallbackText) {
		this.contentTemplateEl = document.getElementById(contentId);
		this.modalTemplateEl = document.getElementById('modal-template');
		this.fallbackText = fallbackText;
	}

	show() {
		// check if browser supports template (IE does not in this case)
		if ("content" in document.createElement("template")) {
			// import the node content
			const modalElements = document.importNode(
        this.modalTemplateEl.content,
        true
      );
			this.modalElement = modalElements.querySelector(".modal");
      this.backdropElement = modalElements.querySelector(".backdrop");
      const contentElement = document.importNode(
        this.contentTemplateEl.content,
        true
			);
			
			this.modalElement.appendChild(contentElement);
			document.body.insertAdjacentElement('afterbegin', this.modalElement);
			document.body.insertAdjacentElement('afterbegin', this.backdropElement);

    } else {
      // fallback code to not supporting templates browsers goes here.
      alert(this.fallbackText);
    }
	}
	hide() {
		if (this.modalElement) {
			document.body.removeChild(this.modalElement); // this.modalElement.remove() --> modern browsers
			document.body.removeChild(this.backdropElement);

			this.modalElement = null;
			this.backdropElement = null;
		}
	}
}