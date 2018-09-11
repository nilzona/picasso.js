
const dockLayoutComponent = {
  layoutStrategy: 'dock'
};

export default function dock(picasso) {
  picasso.layoutStrategy('dock', dockLayoutComponent);
}
