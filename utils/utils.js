export function removeVietnameseAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
