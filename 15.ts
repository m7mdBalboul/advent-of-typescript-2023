type BuildList<
   TElement,
   TNumber extends number,
   TList extends TElement[] = []
> = TList['length'] extends TNumber
   ? TList
   : BuildList<TElement, TNumber, [TElement, ...TList]>;

type BoxToys<TToy extends string, TBox extends number> = {
   [Key in TBox]: BuildList<TToy, Key>;
}[TBox];
